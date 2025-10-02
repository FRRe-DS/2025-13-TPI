[![Build Status](https://github.com/FRRe-DS/2025-TPI/actions/workflows/validate-openapi.yml/badge.svg)](https://github.com/FRRe-DS/2025-TPI/actions/workflows/validate-openapi.yml)
# Desarrollo de Software - 2025

## Consideraciones

En este repositorio se deberán definir todas las interfaces entre los diferentes módulos que contiene el enunciado. Para ello se deberá utilizar [OpenAPI Specification](https://swagger.io/specification/).

## Actividad 1:	Escenario por desarrollar

Como parte del espíritu emprendedor de la cátedra Desarrollo de Software de la Facultad Regional Resistencia de la UTN, se ha decidido incursionar en el mundo de las compras on-line. Se ha encomendado a los alumnos de la cátedra el desarrollo de un sistema de compras on-line compuesto por tres grandes subsistemas. 

1.	Portal de Compras: este subsistema deberá proveer una interfaz al usuario final en el cual los usuarios deberán poder registrarse, autenticarse, realizar búsquedas de productos, compras de los mismo y seguimiento hasta la entrega. (El pago queda para otro momento)

2.	Stock de Bienes y Servicios: este subsistema deberá permitir a los vendedores cargar los productos que deseen que se publiquen para venta en el portal de compras. También deberán proveer interfaces al portal de compras para gestionar el stock de sus bienes y servicios. Los usuarios que ingresen en este subsistema podrán compartir identidad con el de compras, pero deberán tener algún rol que los diferencie. Cuando una compra se concrete en el portal de compras, el portal de compras será el responsable de generar un pedido de entrega en el servicio de transporte y logística, pero también deberá reservar el stock en este servicio. Posteriormente, el servicio de transporte, logística y seguimiento deberá reclamar la entrega de la mercadería reservada, descartarla. En caso de que pase el tiempo de reservar, será este servicio el responsable de liberar el stock comprometido y avisar del suceso.

3.	Transporte, Logística y Seguimiento: este subsistema es el encargado de proveer los medios de transporte al portal de compras. El costo de transporte de una compra será calculado por este servicio en base a las reglas de negocio que este servicio permita introducir. Por ejemplo, para los pedidos que el portal de compras solicite el costo de transporte, este servicio puede utilizar el medio de transporte solicitado (avión, barco, tren, camión), la dirección de entrega, la cantidad de productos, peso de estos, dirección del centro de distribución, etc., y con estos datos calcular el costo del transporte. Para esto el servicio de transporte deberá consultar al servicio de bienes y servicios los detalles y ubicaciones de los productos de una compra. Una vez concretada una compra, este servicio será el responsable de mantener informado al portal de compras de la ubicación y tiempo estimado de entrega del producto. Una vez entregado el producto, este servicio será el responsable de avisar al portar de compras que se ha entregado el producto.

## Distribución de Grupos y Escenarios

| Grupo         | Escenario                           |
| --------------| ----------------------------------- |
| [Grupo 1](https://github.com/orgs/FRRe-DS/teams/grupo-2025-01)   | Portal de Compras                   |
| [Grupo 2](https://github.com/orgs/FRRe-DS/teams/grupo-2025-02)   | Stock de Bienes y Servicios         |
| [Grupo 3](https://github.com/orgs/FRRe-DS/teams/grupo-2025-03)   | Transporte, Logística y Seguimiento |
| [Grupo 4](https://github.com/orgs/FRRe-DS/teams/grupo-2025-04)   | Portal de Compras                   |
| [Grupo 5](https://github.com/orgs/FRRe-DS/teams/grupo-2025-05)   | Stock de Bienes y Servicios         |
| [Grupo 6](https://github.com/orgs/FRRe-DS/teams/grupo-2025-06)   | Transporte, Logística y Seguimiento |
| [Grupo 7](https://github.com/orgs/FRRe-DS/teams/grupo-2025-07)   | Portal de Compras                   |
| [Grupo 8](https://github.com/orgs/FRRe-DS/teams/grupo-2025-08)   | Stock de Bienes y Servicios         |
| [Grupo 9](https://github.com/orgs/FRRe-DS/teams/grupo-2025-09)   | Transporte, Logística y Seguimiento |
| [Grupo 10](https://github.com/orgs/FRRe-DS/teams/grupo-2025-10)  | Portal de Compras                   |
| [Grupo 11](https://github.com/orgs/FRRe-DS/teams/grupo-2025-11)  | Stock de Bienes y Servicios         |
| [Grupo 12](https://github.com/orgs/FRRe-DS/teams/grupo-2025-12)  | Transporte, Logística y Seguimiento |
| [Grupo 13](https://github.com/orgs/FRRe-DS/teams/grupo-2025-13)  | Portal de Compras                   |